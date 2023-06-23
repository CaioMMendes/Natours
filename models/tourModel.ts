import mongoose, { Query } from 'mongoose';
import slugify from 'slugify';

interface Tour {
  name: string;
  slug: string;
  maxGroupSize: number;
  difficulty: string;
  duration: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  createdAt: Date;
  startDates: Date[];
  secretTour: boolean;
}

const tourSchema = new mongoose.Schema<Tour>(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'A tour name must have less or equal then 50 characters'],
      minlength: [5, 'A tour name must have less or equal then 10 characters'],
      //   validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [0, 'The rating must be greater then 0'],
      max: [5, 'The rating must be less then 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a name'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (this: Tour, value: number): boolean {
          //this só funciona quando esta criando um novo documento
          return value < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration && this.duration / 7;
});

//document middleware: runs before only .save() and .create()
tourSchema.pre('save', function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('will save Document');
//   next();
// });

// //executa depois que a função pré é executada
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//query middleware
// tourSchema.pre('find', function (next) {
interface T extends Document {}
tourSchema.pre<Query<T, T>>(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  console.time('query');
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.timeEnd('query');
  next();
});

//aggregation middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
